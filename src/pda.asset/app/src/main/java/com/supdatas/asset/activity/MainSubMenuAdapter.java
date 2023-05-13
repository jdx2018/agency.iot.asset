package com.supdatas.asset.activity;

import android.content.Context;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import com.supdatas.asset.R;
import com.supdatas.asset.model.MainSubMenuEntity;

import java.util.ArrayList;
import java.util.List;

public class MainSubMenuAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {

	private List<MainSubMenuEntity> dataList;
	private Context context;

	public MainSubMenuAdapter(Context context, List<MainSubMenuEntity> datas) {

		if (datas == null) {
			datas = new ArrayList<>();
		}
		this.dataList = datas;
		this.context = context;
	}

	@Override
	public RecyclerView.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {

		View inflate = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_sub_main_menu, parent, false);
		return new VH(inflate, this);
	}

	@Override
	public void onBindViewHolder(RecyclerView.ViewHolder holder, int positionUseLess) {

		final int position = holder.getAdapterPosition();
		((VH)holder).mTvName.setText(dataList.get(position).getTitle());
		((VH)holder).mIvName.setImageResource(dataList.get(position).getResImage());
	}

	public void add(int index) {

		/*Data data = new Data();
		data.setTime(DateUtil.getDateTimeStr1());
		dataList.add(index, data);*/
		notifyItemInserted(index);
	}

	public void remove(int position) {
		dataList.remove(position);
		notifyItemRemoved(position);
	}

	@Override
	public int getItemCount() {
		return dataList.size();
	}

	public static class VH extends RecyclerView.ViewHolder {

		TextView mTvName;
		ImageView mIvName;
		MainSubMenuAdapter adapter;

		VH(View view, MainSubMenuAdapter a1) {
			super(view);
			adapter = a1;
			mTvName = (TextView) view.findViewById(R.id.tv_name);
			mIvName = (ImageView) view.findViewById(R.id.iv_name);

			view.setOnClickListener(new View.OnClickListener() {
				@Override
				public void onClick(View v) {
					/*if (getLayoutPosition() % 2 == 0) {
						adapter.remove(getLayoutPosition());
					} else {
						adapter.add(getLayoutPosition());
					}*/
				}
			});
		}
	}
}
