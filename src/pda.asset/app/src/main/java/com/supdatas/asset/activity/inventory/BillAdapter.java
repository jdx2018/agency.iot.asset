package com.supdatas.asset.activity.inventory;

import android.content.Context;
import android.graphics.Color;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.List;
import com.supdatas.asset.R;
import com.supdatas.asset.model.inventory.InventoryEntity;

public class BillAdapter extends RecyclerView.Adapter<BillAdapter.VH> {

	private List<InventoryEntity> dataList;
	private Context context;
	private  int mPosition;

	public BillAdapter(Context context, List<InventoryEntity> datas) {
		if (datas == null) {
			datas = new ArrayList<>();
		}
		this.dataList = datas;
		this.context = context;
	}

	@Override
	public VH onCreateViewHolder(ViewGroup parent, int viewType) {
		//return new VH(View.inflate(context, R.layout.item_inven_bill, null));
		View inflate = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_inven_bill, parent, false);
		return new VH(inflate);
	}

	@Override
	public void onBindViewHolder(final VH holder, int positionUseLess) {

		final int position = holder.getAdapterPosition();
		holder.mTvBillNo.setText(dataList.get(position).billNo);
		holder.mTvStatus.setText(dataList.get(position).getUploadStatusDesc());
		holder.mTvTime.setText(String.valueOf(dataList.get(position).createTime));
		holder.mTvBillName.setText(dataList.get(position).pdBillName);
		holder.mTvPerson.setText(dataList.get(position).pdPerson);

		holder.itemView.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View v) {

				if (rowClickedListener != null) {
					rowClickedListener.onClick(position);
					notifyDataSetChanged();
				}
			}
		});
		if((position + 1) % 2 == 0){
			holder.itemView.setBackgroundColor(context.getResources().getColor(R.color.light_grey7));
		} else {
			holder.itemView.setBackgroundColor(Color.WHITE);
		}
		if (position == getPosition()) {
			holder.itemView.setBackgroundColor(context.getResources().getColor(R.color.light_blue3));
		}
	}

	@Override
	public int getItemCount() {
		return dataList.size();
	}

	public class VH extends RecyclerView.ViewHolder {

		TextView mTvBillNo;
		TextView mTvStatus;
		TextView mTvBillName;
		TextView mTvTime;
		TextView mTvPerson;

		public VH(View itemView) {
			super(itemView);
			mTvBillNo = (TextView) itemView.findViewById(R.id.tv_bill_no);
			mTvStatus = (TextView) itemView.findViewById(R.id.tv_status);
			mTvBillName = (TextView) itemView.findViewById(R.id.tv_bill_name);
			mTvPerson = (TextView) itemView.findViewById(R.id.tv_person);
			mTvTime = (TextView) itemView.findViewById(R.id.tv_time);
		}
	}

	public interface RowClickedListener {

		void onClick(int position);
	}

	private RowClickedListener rowClickedListener;

	public void setGetListener(RowClickedListener getListener) {
		this.rowClickedListener = getListener;
	}

	public int getPosition() {
		return mPosition;
	}

	public void setPosition(int mPosition) {
		this.mPosition = mPosition;
	}
}
