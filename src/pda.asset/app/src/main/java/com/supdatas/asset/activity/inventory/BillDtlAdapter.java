package com.supdatas.asset.activity.inventory;

import android.content.Context;
import android.graphics.Color;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.supdatas.asset.R;
import com.supdatas.asset.frame.utility.TextUtil;
import com.supdatas.asset.model.ScanEnum;
import com.supdatas.asset.model.inventory.InventoryDtlEntity;

import java.util.ArrayList;
import java.util.List;

public class BillDtlAdapter extends RecyclerView.Adapter<BillDtlAdapter.VH> {

	private List<InventoryDtlEntity> dataList;
	private Context mContext;
	private int mPosition;

	public BillDtlAdapter(Context context, List<InventoryDtlEntity> datas) {

		if (datas == null) {
			datas = new ArrayList<>();
		}
		this.dataList = datas;
		this.mContext = context;
	}

	@Override
	public VH onCreateViewHolder(ViewGroup parent, int viewType) {
		View inflate = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_inven_dtl, parent, false);
		return new VH(inflate);
	}

	@Override
	public void onBindViewHolder(final VH holder, int positionUseLess) {

		int position = holder.getAdapterPosition();
		holder.mTvAssetId.setText(dataList.get(position).assetId);
		holder.mTvAmount.setText(dataList.get(position).assetEntity.amount);
		holder.mTvName.setText(dataList.get(position).assetEntity.assetName);
		holder.mTvEpc.setText(dataList.get(position).assetEntity.epc);
		holder.mTvUsePerson.setText(dataList.get(position).pdPerson);
		holder.mTvScanStatus.setText(dataList.get(position).getStatusDesc());

		/*holder.mLnrSummary.setOnClickListener(new View.OnClickListener(){
			@Override
			public void onClick(View v){

				unfoldItem(holder, position);
			}
		});
		if (mLastPosition < 0 || position == mLastPosition) {

			unfoldItem(holder, position);
			mLastPosition = position;
		}*/
		holder.itemView.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View v) {

				if (rowClickedListener != null) {
					rowClickedListener.onClick(position);
					notifyDataSetChanged();
				}
			}
		});

		if(dataList.get(position).status == 0){
			holder.mTvScanStatus.setTextColor(mContext.getResources().getColor(R.color.orange_red));
		}
		else{
			holder.mTvScanStatus.setTextColor(mContext.getResources().getColor(R.color.blue));
		}

		if((position + 1) % 2 == 0){
			holder.itemView.setBackgroundColor(mContext.getResources().getColor(R.color.light_grey7));
		} else {
			holder.itemView.setBackgroundColor(Color.WHITE);
		}
		if (position == getPosition()) {
			holder.itemView.setBackgroundColor(mContext.getResources().getColor(R.color.light_blue3));
		}
	}

	private VH mLastHolder;
	private int mLastPosition = -1;

	private void unfoldItem(VH vh, int position){

		/*if (mLastHolder != null){

			mLastHolder.mLnrOthers.setVisibility(View.GONE);
			mLastHolder.mIvArrow.setVisibility(View.VISIBLE);
			//mLastHolder.mIvArrow.setImageResource(R.mipmap.infor);
			mLastHolder.mLnrSummary.setBackgroundColor(mContext.getResources().getColor(R.color.transparent));

			mLastPosition = -1;
		}
		mLastHolder = vh;

		if (vh != null){

			vh.mLnrOthers.setVisibility(View.VISIBLE);
			vh.mIvArrow.setVisibility(View.GONE);
			//mLastHolder.mIvArrow.setImageResource(R.mipmap.arrow_top2);
			mLastHolder.mLnrSummary.setBackgroundColor(mContext.getResources().getColor(R.color.light_gray));

			mLastPosition = position;
			mLastHolder = vh;
		}*/
	}

	@Override
	public int getItemCount() {
		return dataList.size();
	}

	/**删除监听器*/
	private ExpendDtlListener mExtDtlListener;

	/**
	 * 设置监听器
	 *
	 * @param listener 监听器
	 */
	public void setOnDelBillListener(ExpendDtlListener listener) {

		this.mExtDtlListener = listener;
	}

	public interface ExpendDtlListener{

		/***
		 * @param product 商品
		 */
		public void onExpend(InventoryDtlEntity product);
	}

	public class VH extends RecyclerView.ViewHolder {

		TextView mTvEpc;
		TextView mTvAssetId;
		TextView mTvAmount;
		TextView mTvName;
		TextView mTvUsePerson;
		TextView mTvScanStatus;

		LinearLayout mLnrSummary;

		public VH(View itemView) {
			super(itemView);

			mTvAssetId = (TextView) itemView.findViewById(R.id.tv_asset_id);
			mTvAmount = (TextView) itemView.findViewById(R.id.tv_amount);
			mTvName = (TextView) itemView.findViewById(R.id.tv_name);
			mTvEpc = (TextView) itemView.findViewById(R.id.tv_epc);
			mTvUsePerson = (TextView) itemView.findViewById(R.id.tv_use_pesson);
			mTvScanStatus = (TextView) itemView.findViewById(R.id.tv_scan_status);

			mLnrSummary = (LinearLayout) itemView.findViewById(R.id.lnr_data);
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
